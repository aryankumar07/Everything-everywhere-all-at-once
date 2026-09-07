#include "./headers/commandinterface.h"
#include <iostream>
#include <unordered_map>

using namespace std;

class RemoteController {
private:
  unordered_map<char, CommandI *> commands;

public:
  void executeCommand(char ch) {
    if (commands.find(ch) == commands.end()) {
      cout << "No Such Command exist" << endl;
      return;
    }
    commands[ch]->execute();
  }

  void setCommand(char ch, CommandI *command) {
    commands[ch] = command;
    cout << "Command added" << endl;
  }
};
