//
//  RnMlKitTextRecognition.swift
//  boost-boost_privacy
//
//  Created by Khanh Le Xuan on 30/11/24.
//

import Foundation
import MLKitTextRecognition
import MLKitVision

class RnMlKitTextRecognitionSwift: NSObject {
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
  
}

