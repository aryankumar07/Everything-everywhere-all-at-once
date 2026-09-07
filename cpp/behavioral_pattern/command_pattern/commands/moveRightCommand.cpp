#include "../headers/commandinterface.h"
#include "../person.cpp"

class MoveRightCommand : public CommandI {
public:
  Person *person;
  MoveRightCommand(Person *person) { this->person = person; }
  void execute() { person->moveRight(); }
};
