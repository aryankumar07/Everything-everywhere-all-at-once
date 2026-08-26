cmake_minimum_required(VERSION 3.20)
project(factory_pattern
    VERSION 1.0
    DESCRIPTION "factory design demo with email"
    LANGUAGES CXX)

add_executable(factory_pattern
    main.cpp
    client.cpp
    ./Factory/alertEmailFactory.cpp
    ./Factory/failedEmailFactory.cpp
    ./Factory/successEmailFactory.cpp
    ./Service/AlertService.cpp
    ./Service/FailedService.cpp
    ./Service/SuccessService.cpp
)

target_include_directories(factory_pattern PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
