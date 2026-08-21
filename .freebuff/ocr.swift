import Foundation
import Vision
import AppKit

let path = CommandLine.arguments[1]
guard let img = NSImage(contentsOfFile: path),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("ERR: cannot load image")
    exit(1)
}
let req = VNRecognizeTextRequest { request, error in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    // Sort top-to-bottom, left-to-right
    let sorted = observations.sorted { a, b in
        if abs(a.boundingBox.midY - b.boundingBox.midY) > 0.02 {
            return a.boundingBox.midY > b.boundingBox.midY
        }
        return a.boundingBox.minX < b.boundingBox.minX
    }
    for obs in sorted {
        if let top = obs.topCandidates(1).first {
            print(top.string)
        }
    }
}
req.recognitionLevel = .accurate
req.usesLanguageCorrection = true
do {
    try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
} catch {
    print("ERR: \(error)")
    exit(1)
}
