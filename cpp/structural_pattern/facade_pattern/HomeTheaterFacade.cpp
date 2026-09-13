#include "HomeTheaterFacade.hpp"

HomeTheaterFacade::HomeTheaterFacade()
    : amplifier(nullptr), light(new Light(1)), monitor(new Monitor()),
      streaming(new Streaming()), speaker(new Speaker(20)) {
  amplifier = new Amplifier(speaker);
}

HomeTheaterFacade::~HomeTheaterFacade() {
  delete amplifier;
  delete light;
  delete monitor;
  delete streaming;
  delete speaker;
}

void HomeTheaterFacade::watchMovie() {
  streaming->on();
  monitor->on();
  speaker->on();
  light->on();
}

void HomeTheaterFacade::listenMusic() {
  streaming->on();
  speaker->on();
}

void HomeTheaterFacade::stopMovie() {
  streaming->off();
  monitor->off();
  speaker->off();
  light->off();
}

void HomeTheaterFacade::stopMusic() {
  streaming->off();
  speaker->off();
}

void HomeTheaterFacade::incSound(int val) { speaker->inc(val); }
void HomeTheaterFacade::decSound(int val) { speaker->dec(val); }
void HomeTheaterFacade::mute() { speaker->mute(); }
void HomeTheaterFacade::resume() { speaker->resume(); }
void HomeTheaterFacade::toggleAmplifier() { amplifier->toggle(); }
void HomeTheaterFacade::amplifySound(int val) { amplifier->inc(val); }
