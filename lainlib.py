# coding=utf-8

from numpy.linalg import inv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import tkinter as tk
import PIL as pil
from PIL import Image
from PIL import ImageTk


class Stack:

    def __init__(self):
        self.__list = ['stack_button']
        self.__pointer = 0
        self.size = 0
    #end

    def top(self):
        return self.__list[self.__pointer]
    #end

    def push(self, element):
        self.__list.append(element)
        self.__pointer += 1
        self.size += 1
    #end

    def pop(self):
        top_element = self.__list[self.__pointer]
        if self.size == 0:
            return top_element
        #end
        else:
            del self.__list[self.__pointer]
            self.__pointer -= 1
            self.size -= 1
            return top_element
        #end if
    #end

    def clear(self):
        self.__list = ['stack_button']
        self.__pointer = 0
        self.size = 0


#end class Stack













