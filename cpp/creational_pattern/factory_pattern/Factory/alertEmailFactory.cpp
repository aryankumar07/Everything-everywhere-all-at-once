#include "../Service/AlertService.cpp"
#include "../emailFactory.h"

class AlertEmailFactory : public EmailFactory {
public:
  EmailService *createFactory() { return new AlertService(); }
};
