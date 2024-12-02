//
//  RnMlKitTextRecognition.swift
//  boost-boost_privacy
//
//  Created by Khanh Le Xuan on 30/11/24.
//

import Foundation
import MLKitTextRecognition
import MLKitVision
import MLKitDigitalInkRecognition

class DigitalInkHandler {
    static let shared = DigitalInkHandler()
    
    let model: DigitalInkRecognitionModel
    let modelManager: ModelManager
    let conditions: ModelDownloadConditions
    let options: DigitalInkRecognizerOptions
    let recognizer: DigitalInkRecognizer
    let identifier: DigitalInkRecognitionModelIdentifier?
    
    private init() {
        identifier = DigitalInkRecognitionModelIdentifier(forLanguageTag: "en-US")
        
        guard let identifier = identifier else {
            fatalError("No model was found or the language tag couldn't be parsed.")
        }
        
        model = DigitalInkRecognitionModel(modelIdentifier: identifier)
        modelManager = ModelManager.modelManager()
        conditions = ModelDownloadConditions(allowsCellularAccess: true, allowsBackgroundDownloading: true)
        
        modelManager.download(model, conditions: conditions)
        
        options = DigitalInkRecognizerOptions(model: model)
        recognizer = DigitalInkRecognizer.digitalInkRecognizer(options: options)
    }
}



class RnMlKitTextRecognitionSwift: NSObject {
  static let kMillisecondsPerTimeInterval = 1000.0
  
  @objc
  static func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b*2)
  }

  static func listFoldersInTempDirectory() -> [String] {
      let tempDirectory = FileManager.default.temporaryDirectory
      do {
          let contents = try FileManager.default.contentsOfDirectory(atPath: tempDirectory.path)
          let folders = contents.filter { item in
              var isDirectory: ObjCBool = false
              let fullPath = tempDirectory.appendingPathComponent(item).path
              FileManager.default.fileExists(atPath: fullPath, isDirectory: &isDirectory)
              return isDirectory.boolValue
          }
          return folders
      } catch {
          print("Error listing contents of temp directory: \(error)")
          return []
      }
  }
  
  static func getImageFromTempDirectory(fileName: String) -> UIImage? {
    let tempDirectory = FileManager.default.temporaryDirectory
    let fileURL = tempDirectory.appendingPathComponent(fileName)
    guard let imageData = try? Data(contentsOf: fileURL) else {
      print("Failed to load image data from temporary directory.")
      return nil
    } 
    return UIImage(data: imageData)
  }

  
  @objc
  static func getTextFrom(path: String,  resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) -> Void {
    guard let image = getImageFromTempDirectory(fileName: path) else {
        print("Cannot get image from path: \(path)")
        reject("", "Cannot get image from path: \(path)", nil)
        return
    }
    
    let visionImage = VisionImage(image: image)
    visionImage.orientation = image.imageOrientation
    print("visionImage: \(visionImage)")
    
    let latinOptions = TextRecognizerOptions()
    let latinTextRecognizer = TextRecognizer.textRecognizer(options:latinOptions)
    latinTextRecognizer.process(visionImage) { result, error in
      guard error == nil, let result = result else {
        reject("", "Cannot get result from latinTextRecognizer: \(error?.localizedDescription ?? "")", nil)
        return
      }
      
      
      // Recognized text
      let resultText = result.text
      print("text from result: \(resultText)")
      resolve(resultText)
    }
  }
  
  @objc
  static func getTextFrom(points: NSArray,  resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) -> Void {
    var pointArr = points as! [[Int]]
    for index in pointArr.indices {
      pointArr[index][2] = Int(Date().timeIntervalSince1970 * kMillisecondsPerTimeInterval) + index*100
    }
    
    print(pointArr)
    let mlPoints = pointArr.map { StrokePoint(x: Float($0[0]), y: Float($0[1]), t: $0[2]) }
    let strokes = Stroke(points: mlPoints)
    let ink = Ink.init(strokes: [strokes])
    
    DigitalInkHandler.shared.recognizer.recognize(
        ink: ink,
        completion: {
          (result: DigitalInkRecognitionResult?, error: Error?) in
          var alertTitle = ""
          var alertText = ""
          if let result = result, let candidate = result.candidates.first {
            alertTitle = "I recognized this:"
            alertText = candidate.text
            resolve(candidate.text)
          } else {
            alertTitle = "I hit an error:"
            alertText = error!.localizedDescription
            reject("", "Digital Ink Request Error: ", error)
          }
          print("\(alertTitle) \(alertText)")
        }
      )
    
  }
  
}

