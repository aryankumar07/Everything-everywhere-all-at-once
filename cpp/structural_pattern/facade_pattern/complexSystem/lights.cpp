#include "lights.hpp"
#include <iostream>

Light::Light(int intensity) : intensity(intensity) {}

void Light::on() { std::cout << "Started Lights" << std::endl; }
void Light::off() { std::cout << "Stopped Lights" << std::endl; }
void Light::inc(int val) { this->intensity += val; }
void Light::dec(int val) { this->intensity -= val; }
