#include "speaker.hpp"
#include <iostream>

Speaker::Speaker(int volume) : volume(volume), prev(volume) {}

void Speaker::on() { std::cout << "Started speakers" << std::endl; }
void Speaker::off() { std::cout << "Stopped speakers" << std::endl; }
void Speaker::mute() { this->volume = 0; }
void Speaker::resume() { this->volume = prev; }

void Speaker::inc(int val) {
  if (this->volume + val > 100) {
    std::cout << "Cant increase more than this use an amplifier" << std::endl;
    return;
  }
  this->volume += val;
  this->prev = this->volume;
}

void Speaker::dec(int val) {
  this->volume -= val;
  this->prev = this->volume;
}

void Speaker::amplify(int val) {
  this->volume += val;
  this->prev = this->volume;
}
