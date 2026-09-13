cmake_minimum_required(VERSION 3.20)
project("facade_pattern"
  DESCRIPTION "facade_pattern"
  LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(${PROJECT_NAME}
  main.cpp
  HomeTheaterFacade.cpp
  complexSystem/amplifier.cpp
  complexSystem/lights.cpp
  complexSystem/monitor.cpp
  complexSystem/speaker.cpp
  complexSystem/streaming.cpp
)

target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
