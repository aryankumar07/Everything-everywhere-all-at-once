#include "../headers/commandinterface.h"
#include "../person.cpp"

class JumpCommand : public CommandI {
public:
  Person *person;
  JumpCommand(Person *person) { this->person = person; }
  void execute() { person->jump(); }
};
