#include "./commands/duckCommand.cpp"
#include "./commands/jumpCommand.cpp"
#include "./commands/kickCommand.cpp"
#include "./commands/moveLeftCommand.cpp"
#include "./commands/moveRightCommand.cpp"
#include "./controller.cpp"
#include "./person.cpp"

using namespace std;

int main() {
  Person *person = new Person();
  RemoteController *controller = new RemoteController();
  MoveleftCommand *leftCommand = new MoveleftCommand(person);
  MoveRightCommand *rightCommand = new MoveRightCommand(person);
  KickCommand *kickCommand = new KickCommand(person);
  JumpCommand *jumpCommand = new JumpCommand(person);
  DuckCommand *duckCommand = new DuckCommand(person);
  controller->setCommand('r', leftCommand);
  controller->setCommand('l', rightCommand);
  controller->setCommand('j', jumpCommand);
  controller->setCommand('k', kickCommand);
  controller->setCommand('m', duckCommand);
  controller->executeCommand('l');
  controller->executeCommand('r');
  controller->executeCommand('j');
  controller->executeCommand('k');
  controller->executeCommand('m');
  return 0;
}
