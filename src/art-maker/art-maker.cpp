#include <stdio.h>
#include <iostream>
#include <fstream>
#include <SDL.h>
#include <SDL_image.h>
#include <emscripten/bind.h>
#include "color-hsl.hpp"

// TODO improve ascii ranges
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

	float section =  360 / 59.0;	//59 unique characters
	char sign = static_cast<char>(34 + colorHsl.hue / section); //ASCII from 34 to 90
	return sign;
}

SDL_Color getPixelColor(const SDL_Surface* surface, int x, int y)
{
    const Uint8 bytesPerPixel = surface->format->BytesPerPixel;
    Uint8* pixel = (Uint8*)surface->pixels + y * surface->pitch + x * bytesPerPixel;
    Uint32 pixelData = *(Uint32*)pixel;
    SDL_Color Color = {0x00, 0x00, 0x00, SDL_ALPHA_OPAQUE};
    SDL_GetRGB(pixelData, surface->format, &Color.r, &Color.g, &Color.b);
    return Color;
}

void run(std::string inputFileName, std::string outputFileName, uint reduceWidthByTimes) {
    std::cout << "Processing image" << std::endl;

    IMG_Init(IMG_INIT_PNG);

    SDL_Surface* image = IMG_Load(inputFileName.c_str());
    auto error = SDL_GetError();
    if(!error || error[0]) {
        SDL_ClearError();
        std::cout << "Image loading error" << std::endl;
        throw std::runtime_error(error);
    }

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
    for(int i = 0; i < verticalSingsCount; i++) {
        for (int j = 0; j < horizontalSingsCount; j++) {
            auto color = getPixelColor(image, j * reduceWidthByTimes, i * reduceHeightByTimes);
            outputFile << mapColorToCharacter(color);
        }
         outputFile << std::endl;
    }
    outputFile.close();

    IMG_Quit();
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
