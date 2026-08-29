#include "./Observers/console.cpp"
#include "./Observers/desktop.cpp"
#include "./Observers/mobile.cpp"
#include "./Products/Netflix.cpp"
#include "./headers/ObserverInterface.h"
#include "./headers/ProductInterface.h"
#include <string>
#include <vector>

using namespace std;

int main() {
  ProductI *netflix = new Netflix();
  vector<string> movies = {"Dragon Ball", "Insception", "One piece",
                           "Demon Slayer", "Bleach"};

  for (int i = 0; i < 2; i++) {
    string mnmae = "Alice mobile " + to_string(i);
    ObserverI *m = new Mobile(mnmae);
    netflix->addObserver(m);
    // string dnmae = "Alice desktop " + to_string(i);
    // ObserverI *c = new Console(cnmae);
    // netflix->addObserver(d);
    // string cnmae = "Alice cnmae " + to_string(i);
    // ObserverI *d = new Desktop(dnmae);
    // netflix->addObserver(c);
  }

  for (auto movie : movies)
    netflix->notifyUsers(movie);

  return 0;
}
