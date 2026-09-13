#include "amplifier.hpp"
#include <iostream>

Amplifier::Amplifier(Speaker *speaker) : speaker(speaker), on(false) {}

void Amplifier::toggle() { this->on = !this->on; }

void Amplifier::inc(int val) {
  if (this->on) {
    speaker->amplify(val);
  } else {
    std::cout << "Turn on the Amplifier" << std::endl;
  }
}
