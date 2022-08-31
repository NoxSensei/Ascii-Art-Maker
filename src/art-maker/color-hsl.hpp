#include <tuple>

enum ColorType {
    red,
    green,
    blue
};

class ColorHsl {
public:
    float hue;
    float saturation;
    float lightness;

    ColorHsl(float, float, float);

    static ColorHsl fromRgb(float, float, float);

private:
    static std::tuple<float, float, ColorType> findIntervalsExtremes(float, float, float);

    static float calculateHue(ColorType, float, float, float, float);
};
