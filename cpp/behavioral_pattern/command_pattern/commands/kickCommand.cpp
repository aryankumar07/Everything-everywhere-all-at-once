#include "../headers/commandinterface.h"
#include "../person.cpp"

class KickCommand : public CommandI {
public:
  Person *person;
  KickCommand(Person *person) { this->person = person; }
  void execute() { person->kick(); }
};
