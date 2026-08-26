#include "../Service/FailedService.cpp"
#include "../emailFactory.h"

class FailedEmailFactory : public EmailFactory {
public:
  EmailService *createFactory() { return new FailedService(); }
};
