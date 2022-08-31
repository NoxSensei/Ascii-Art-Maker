#include <cstdlib>
#include <cmath>
#include <tuple>
#include "color-hsl.hpp"

ColorHsl::ColorHsl(float hue, float saturation, float lightness)
{
    this->hue = hue;
    this->saturation = saturation;
    this->lightness = lightness;
}

ColorHsl ColorHsl::fromRgb(float red, float green, float blue)
{
	auto redInterval = red / 255.0;
	auto greenInterval = green / 255.0;
	auto blueInterval = blue / 255.0;

    auto [ min, max, maxColor ] = ColorHsl::findIntervalsExtremes(redInterval, greenInterval, blueInterval);

    auto delta = max - min;
    auto lightness = (max + min) * 0.5;

    if (delta == 0)
    {
        return ColorHsl(0, 0, lightness);
    }

    auto hue = ColorHsl::calculateHue(maxColor, delta, redInterval, greenInterval, blueInterval);
    auto saturation = delta / (1 - abs(2 * lightness - 1));
    return ColorHsl(hue, saturation, lightness);
}

std::tuple<float, float, ColorType> ColorHsl::findIntervalsExtremes(float redInterval, float greenInterval, float blueInterval) {
    float max;
    float min;
    ColorType maxColor;

    if (redInterval > greenInterval)
    {
        min = greenInterval;
        max = redInterval;
        maxColor = ColorType::red;
    }
    else
    {
        min = redInterval;
        max = greenInterval;
        maxColor = ColorType::green;
    }

    if (max < blueInterval)
    {
        max = blueInterval;
        maxColor = ColorType::blue;
    }

    if (min > blueInterval)
    {
        min = blueInterval;
    }

    return std::make_tuple(min, max, maxColor);
}

float ColorHsl::calculateHue(ColorType maxColor, float delta, float redInterval, float greenInterval, float blueInterval) {
    switch(maxColor) {
        case ColorType::red:
            return 60 * std::fmod((greenInterval - blueInterval) / delta, 6);
        case ColorType::green:
            return 60 * ((blueInterval - redInterval) / delta + 2);
        case ColorType::blue:
            return 60 * ((redInterval - greenInterval) / delta + 4);
    }
}
