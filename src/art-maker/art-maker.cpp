#include <stdio.h>
#include <iostream>
#include <fstream>
#include <SDL.h>
#include <SDL_image.h>
#include <emscripten/bind.h>
#include "color-hsl.hpp"
#include "sdl-helper.hpp"


char mapColorToCharacter(SDL_Color color);

void run(std::string inputFileName, std::string outputFileName, uint reduceWidthByTimes) {
    auto sdlHelper = SdlHelper();
    auto image = sdlHelper.loadImage(inputFileName);

    std::cout << "Image loaded" << std::endl;
    std::cout << "Width: " << image->w << " Height: " << image->h << std::endl;

    // Ascii characters are 2 times higher then wider
    auto reduceHeightByTimes = 2 * reduceWidthByTimes;
    auto horizontalSingsCount = image->w/reduceWidthByTimes;
    auto verticalSingsCount = image->h/reduceHeightByTimes;

    std::cout<< "Horizontal signs: " << horizontalSingsCount << " Vertical signs: " << verticalSingsCount << std::endl;

    std::ofstream outputFile;
    outputFile.open(outputFileName);
    char *line = new char[horizontalSingsCount];
    for(int verticalSignIndex = 0; verticalSignIndex < verticalSingsCount; verticalSignIndex++) {
        for (int horizontalSignIndex = 0; horizontalSignIndex < horizontalSingsCount; horizontalSignIndex++) {
            auto color = sdlHelper.getPixelColor(image, horizontalSignIndex * reduceWidthByTimes, verticalSignIndex * reduceHeightByTimes);
            outputFile << mapColorToCharacter(color);
        }
        outputFile << std::endl;
    }
    outputFile.close();
}

char mapColorToCharacter(SDL_Color color)
{
    auto colorHsl = ColorHsl::fromRgb((int)color.r, (int)color.g, (int)color.b);
	if (colorHsl.hue == 0)
	{
	    //color white
		if (colorHsl.lightness == 1)
		{
			return 32;
		}

		//color black
		if (colorHsl.lightness == 0)
		{
			return 33;
		}
	}

    const auto asciiRangeStart = 34;
    const auto asciiRangeEnd = 90;
    const auto charactersCount = asciiRangeEnd - asciiRangeStart;
	const float hueRange =  360.0 / charactersCount;
	char sign = static_cast<char>(asciiRangeStart + colorHsl.hue / hueRange);
	return sign;
}

std::string extractExceptionMessage(int exceptionPtr) {
    auto exception = reinterpret_cast<std::exception *>(exceptionPtr);
    auto exceptionMessage = exception->what();
    return std::string(exceptionMessage);
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("run", &run);
    emscripten::function("extractExceptionMessage", &extractExceptionMessage);
}
