#pragma once
#include "emailService.h"

class EmailFactory {
public:
  virtual EmailService *createFactory() = 0;
  virtual ~EmailFactory() = default;
};
