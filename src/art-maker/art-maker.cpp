#include <stdio.h>
#include <iostream>
#include <fstream>
#include <emscripten/bind.h>

void smthFile (std::string inputFileName, std::string outputFileName) {
        std::fstream fs;
        fs.open (inputFileName, std::fstream::in | std::fstream::binary);
        if (fs) {
            std::string myText;

            while (getline (fs, myText)) {
              // Output the text from the file
              std::cout << myText;
            }

            fs.close();
            std::cout << "File '" + inputFileName + "' exists!" << std::endl;
        } else {
            std::cout << "File '" + inputFileName + "' does NOT exist!" << std::endl;
        }
    }

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("smthFile", &smthFile);
}
