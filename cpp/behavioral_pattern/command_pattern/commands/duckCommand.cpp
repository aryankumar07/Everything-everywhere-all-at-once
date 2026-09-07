#include "../headers/commandinterface.h"
#include "../person.cpp"

class DuckCommand : public CommandI {
public:
  Person *person;
  DuckCommand(Person *person) { this->person = person; }
  void execute() { person->duck(); }
};
