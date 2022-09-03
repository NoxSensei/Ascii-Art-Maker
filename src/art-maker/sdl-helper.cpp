#include <string>
#include <SDL.h>
#include <SDL_image.h>
#include "sdl-helper.hpp"

SdlHelper::SdlHelper(){
    IMG_Init(IMG_INIT_PNG);
}

SdlHelper::~SdlHelper(){
    IMG_Quit();
}

SDL_Surface* SdlHelper::loadImage(std::string fileName) {
    SDL_Surface* image = IMG_Load(fileName.c_str());
    auto error = SDL_GetError();
    if(!error || error[0]) {
        SDL_ClearError();
        throw std::runtime_error(error);
    }
    return image;
}

SDL_Color SdlHelper::getPixelColor(SDL_Surface* surface, int x, int y)
{
    const Uint8 bytesPerPixel = surface->format->BytesPerPixel;
    Uint8* pixel = (Uint8*)surface->pixels + y * surface->pitch + x * bytesPerPixel;
    Uint32 pixelData = *(Uint32*)pixel;
    SDL_Color Color = {0x00, 0x00, 0x00, SDL_ALPHA_OPAQUE};
    SDL_GetRGB(pixelData, surface->format, &Color.r, &Color.g, &Color.b);
    return Color;
}
