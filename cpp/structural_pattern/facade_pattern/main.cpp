#include "HomeTheaterFacade.hpp"

int main() {
  HomeTheaterFacade *facade = new HomeTheaterFacade();

  facade->watchMovie();
  facade->incSound(10);
  facade->toggleAmplifier();
  facade->amplifySound(50);
  facade->stopMovie();

  delete facade;
  return 0;
}
