package com.rnmlkittextrecognition

import android.adservices.ondevicepersonalization.ModelManager
import android.graphics.BitmapFactory
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.Arguments
import com.google.mlkit.common.MlKitException
import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.common.model.RemoteModelManager
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.digitalink.DigitalInkRecognition
import com.google.mlkit.vision.digitalink.DigitalInkRecognitionModel
import com.google.mlkit.vision.digitalink.DigitalInkRecognitionModelIdentifier
import com.google.mlkit.vision.digitalink.DigitalInkRecognizer
import com.google.mlkit.vision.digitalink.DigitalInkRecognizerOptions
import com.google.mlkit.vision.digitalink.Ink
import com.google.mlkit.vision.digitalink.RecognitionResult
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.tasks.await
import java.io.File
import kotlin.coroutines.resume

class DigitalInkHandler private constructor() {
  private lateinit var modelIdentifier: DigitalInkRecognitionModelIdentifier
  lateinit var model: DigitalInkRecognitionModel
  private val modelManager: RemoteModelManager = RemoteModelManager.getInstance()
  lateinit var options: DigitalInkRecognizerOptions
  lateinit var recognizer: DigitalInkRecognizer
  private val scopeDefault = CoroutineScope(Dispatchers.Default)
  private val scopeIO = CoroutineScope(Dispatchers.IO)

  private object Holder { val INSTANCE = DigitalInkHandler() }

  companion object {
    @JvmStatic
    fun instance(): DigitalInkHandler {
      return Holder.INSTANCE
    }
  }

  private suspend fun downloadModel(model: DigitalInkRecognitionModel): Boolean {
    val remoteModelManager = RemoteModelManager.getInstance()
    return suspendCancellableCoroutine { continuation ->
      remoteModelManager.download(model, DownloadConditions.Builder().build())
        .addOnSuccessListener {
          continuation.resume(true)
        }
        .addOnFailureListener { e: Exception ->
          continuation.resume(false)
        }
    }
  }

  suspend fun prepare() {
    try {
      modelIdentifier = DigitalInkRecognitionModelIdentifier.fromLanguageTag("en-US")!!
      model = DigitalInkRecognitionModel.builder(modelIdentifier).build()
      val isModelDownloaded = modelManager.isModelDownloaded(model).await()
      if (!isModelDownloaded) {
        modelManager.download(model, DownloadConditions.Builder().build()).await()
      }
      options = DigitalInkRecognizerOptions.builder(model).build()
      recognizer = DigitalInkRecognition.getClient(DigitalInkRecognizerOptions.builder(model).build())
    } catch (e: MlKitException) {
      // Handle the error appropriately
      e.printStackTrace()
    }
  }

}

class RnMlKitTextRecognitionModule internal constructor(context: ReactApplicationContext) :
  RnMlKitTextRecognitionSpec(context) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  override fun getTextFromPath(path: String?, promise: Promise?) {
    val rPath = path!!.replace("file:", "")
    val imgFile = File(rPath)
    if (!imgFile.exists()) {
      Log.e(name, "cannot get image from path: $path")
      promise?.reject("error", "cannot get image from path: $path")
      return
    }

    // 3
    val bitmap = BitmapFactory.decodeFile(imgFile.absolutePath)
    val image = InputImage.fromBitmap(bitmap, 0)
    val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
    recognizer.process(image)
      .addOnSuccessListener { visionText ->
        print("result from text recognizer ${visionText.text}")
        Log.i(name, "result from text recognizer ${visionText.text}")
        promise?.resolve(visionText.text)
      }
      .addOnFailureListener { e ->
        print("Error during recognition: $e")
        Log.e(name, "Error during recognition: $e")
        promise?.reject("error", "Error during recognition: $e");
      }
  }

  private fun convertReadableArrayToList(readableArray: ReadableArray): List<List<Int>> {
    val outerList = mutableListOf<List<Int>>()

    for (i in 0 until readableArray.size()) {
      val innerArray = readableArray.getArray(i)
      val innerList = mutableListOf<Int>()

      for (j in 0 until innerArray.size()) {
        innerList.add(innerArray.getInt(j))
      }

      outerList.add(innerList)
    }

    return outerList
  }


  override fun getTextFromPoints(points: ReadableArray?, promise: Promise?) {
    runBlocking {
      val listPoints = convertReadableArrayToList(points ?: Arguments.createArray())
      val stroke = Ink.Stroke.builder()
      listPoints.forEachIndexed {index, value ->
        val mlPoint = Ink.Point.create(
          value[0].toFloat(),
          value[1].toFloat(),
          System.currentTimeMillis() + index * 100,
        )
        stroke.addPoint(mlPoint)
      }

      val ink = Ink.builder().addStroke(stroke.build()).build()
      // Specify the recognition model for a language
      DigitalInkHandler.instance().prepare()
      DigitalInkHandler.instance().recognizer.recognize(ink)
        .addOnSuccessListener { result: RecognitionResult ->
          // `result` contains the recognizer's answers as a RecognitionResult.
          // Logs the text from the top candidate.
          print("result from recognizer ${result.candidates[0].text}")
          Log.i(name, "result from recognizer ${result.candidates[0].text}")
          promise?.resolve(result.candidates[0].text)
        }
        .addOnFailureListener { e: Exception ->
          print("Error during recognition: $e")
          Log.e(name, "Error during recognition: $e")
          promise?.reject("error", "Error during recognition: $e");
        }
    }

  }

  companion object {
    const val NAME = "RnMlKitTextRecognition"
  }
}
