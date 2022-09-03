#include <string>
#include <SDL.h>

class SdlHelper {
public:
    SdlHelper();

    ~SdlHelper();

    SDL_Surface* loadImage(std::string);

    SDL_Color getPixelColor(SDL_Surface*, int, int);
};
