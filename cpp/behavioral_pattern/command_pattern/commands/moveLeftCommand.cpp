#include "../headers/commandinterface.h"
#include "../person.cpp"

class MoveleftCommand : public CommandI {
public:
  Person *person;
  MoveleftCommand(Person *person) { this->person = person; }
  void execute() { person->moveLeft(); }
};
