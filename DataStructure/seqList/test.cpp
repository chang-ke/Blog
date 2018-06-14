#include<iostream>
#include"SeqList.h"

int main() {
    int a[3] = { 1,2,3 };
    SeqList<int> *list = new SeqList<int>(a, 3);
    std::cout << list->GetLength() << std::endl;
    return 0;
}