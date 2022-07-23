#include <stdio.h>
#include <iostream>
#include <fstream>
#include <emscripten/bind.h>

void smthFile (std::string fileName) {
        std::fstream fs;
        fs.open (fileName, std::fstream::in | std::fstream::binary);
        if (fs) {
            fs.close();
            std::cout << "File '" + fileName + "' exists!" << std::endl;
        } else {
            std::cout << "File '" + fileName + "' does NOT exist!" << std::endl;
        }
    }

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("smthFile", &smthFile);
}
