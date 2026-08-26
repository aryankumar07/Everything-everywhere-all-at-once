#include "emailFactory.h"
class Client {
private:
  EmailService *service;

public:
  void setService(EmailFactory *factory) {
    this->service = factory->createFactory();
  }
  EmailService *getService() { return service; }
};
