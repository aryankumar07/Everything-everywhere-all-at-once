#include "Logger.hpp"
#include <limits>

using namespace std;

int main() {
  Logger &console = Logger::getInstance();
  int flag = 1;
  while (flag) {
    string input;
    cout << "enter something to log: ";
    getline(cin, input);
    console.log(input);

    cout << "Enter 0 to stop 1 to continue: ";
    cin >> flag;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
  }
  return 0;
}
