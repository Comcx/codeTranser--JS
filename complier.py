# coding=utf-8

from lainlib import *




#________________________________________________________________/


class Scanner:

    def __init__(self, file):
        self.__file = open(file, 'r', encoding = 'utf-8')
        self.file_name = file
        self.content = self.read()
        self.pointer = 0
        self.__stack = Stack()
    #end

    def read(self, counter = None):
        content = self.__file.read(counter)
        return content
    #end

    def get_token(self, is_same):

        def is_blank(test_ch):
            return test_ch == ' ' or test_ch == '\t' or test_ch == '\n'
        #end

        buffer = ''
        while self.pointer < len(self.content) and \
                is_blank(self.content[self.pointer]):
            self.pointer += 1
        #end
        while self.pointer < len(self.content) and \
                is_same(self.content[self.pointer]):
            buffer += self.content[self.pointer]
            self.pointer += 1
        #end while
        return buffer
    #end

    def lex(self):

        def is_blank(test_ch):
            return test_ch == ' ' or test_ch == '\t' or test_ch == '\n'
        #end

        def is_letter(test_ch):
            return test_ch.isalpha()
        #end

        def is_number(test_ch):
            return test_ch.isdigit()
        #end

        def is_underline(test_ch):
            return test_ch == '_'
        #end

        def is_operator(test_ch):
            operator_set = [
                '+', '-', '*', '/', \
                '!', '@', '#', '$', \
                '%', '^', '&', '~', \
                '=', '-', '|', '?', \
                '<', '>', ':', ';', \
                ',', '.', '\\'
            ]
            return test_ch in operator_set
        #end

        def is_kept(token):
            kept_set = [
                'def', 'import', 'if', 'else', \
                'for', 'while', 'and', 'or', \
                ]
            return token in kept_set
        #end




        ans = []
        str_flag = False
        str_tmp = ''
        self.pointer = 0
        while self.pointer < len(self.content):

            elem = {}
            current = self.content[self.pointer]

            if str_flag == True and current != "'" and current != '"':
                str_tmp += current
                self.pointer += 1
                continue

            if is_letter(current) or is_underline(current):

                token = self.get_token(
                    lambda ch: is_letter(ch) or is_underline(ch))

                if is_kept(token):

                    ans.append({'type': 'kept', 'value': token})
                else:
                    ans.append({'type': 'word', 'value': token})

            elif is_number(current):
                ans.append({'type': 'number',
                        'value': self.get_token(is_number)})

            elif is_operator(current):
                token = self.get_token(is_operator)

                if token == '//' or token == '#':
                    while self.pointer < len(self.content) and \
                          self.content[self.pointer] != '\n':
                        self.pointer += 1
                else:
                    ans.append({'type': 'operator', 'value': token})

            elif current == '{' or current == '}':
                ans.append({'type': 'brace',
                        'value': current})
                self.pointer += 1

            elif current == '(' or current == ')':
                ans.append({'type': 'bracket',
                        'value': current})
                self.pointer += 1

            elif current == '[' or current == ']':
                ans.append({'type': 'square',
                        'value': current})
                self.pointer += 1

            elif current == '"' or current == "'":

                if str_flag == True:
                    str_flag = False
                    ans.append({'type': 'string',
                                'value': str_tmp})
                    str_tmp = ''
                else:   str_flag = True
                self.pointer += 1

            elif is_blank(current) and not str_flag:
                self.pointer += 1
                pass

            else:
                ans.append({'type': 'unknown', 'value': current})
                self.pointer += 1

            #end if

        #end while

        return ans
    #end


#end class Scanner

#________________________________________________________________/


class Parser:

    def __init__(self, list):
        self.__list = list
        self.pointer = 0
    #end

    def parse(self):
        AST = {'type': 'Domain', 'body': []}

        def go():
            #self.pointer += 1

            token = self.__list[self.pointer]

            if  token['type'] == 'word':
                token['type'] = 'Variable'
                self.pointer += 1
                return token


            elif token['type'] == 'number':
                token['type'] = 'Number'
                self.pointer += 1
                return token

            elif token['type'] == 'string':
                token['type'] = 'String'
                self.pointer += 1
                return token

            elif token['type'] == 'operator':
                token['type'] = 'Operator'
                self.pointer += 1
                return token

            elif token['type'] == 'bracket' and token['value'] == '(':
                self.pointer += 1
                token = self.__list[self.pointer]

                node = {'type': 'CallExpression', 'params': []}
                while (self.pointer < len(self.__list)) and \
                      (token['type'] != 'bracket' or \
                      token['type'] == 'bracket' and token['value'] == '('):

                    node['params'].append(go())
                    token = self.__list[self.pointer]
                #end while

                self.pointer += 1
                return node


            elif token['type'] == 'brace' and token['value'] == '{':
                self.pointer += 1
                token = self.__list[self.pointer]
                node = {'type': 'Domain', 'body': []}

                while (self.pointer < len(self.__list)) and \
                      (token['type'] != 'brace' or \
                      token['type'] == 'brace' and token['value'] == '{'):

                    node['body'].append(go())
                    token = self.__list[self.pointer]
                # end while

                self.pointer += 1
                return node

            #end if
            self.pointer += 1
            return token
        #end go


        while self.pointer < len(self.__list):
            AST['body'].append(go())


        return AST
    #end parse()


    def show_body(self, body, counter = 0):

        def show_item(elem, counter):
            for i in range(counter):    print('\t', end='')
            print(elem['type'] + ' ' + elem['value'])
        # end

        for elem in body:

            if elem['type'] == 'Domain':
                for i in range(counter):    print('\t', end='')
                print('-> Domain: ')
                self.show_body(elem['body'], counter + 1)
                print()
            elif elem['type'] == 'CallExpression':
                for i in range(counter):    print('\t', end='')
                print('-> CallExpression: ')
                self.show_body(elem['params'], counter + 1)
                print()
            else:
                show_item(elem, counter)
        #end for
    #end


#end class Parser

#________________________________________________________________/



scanner = Scanner('C:/Users/HP/Desktop/Planner.h')

raw = scanner.lex()
parser = Parser(raw)
AST = parser.parse()



parser.show_body(AST['body'])










