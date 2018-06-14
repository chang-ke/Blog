#include<iostream>
#include"ArrayList.h"
using namespace std;

int main() {
    ArrayList<int> A = ArrayList<int>();
    for (int i = 0; i < 20; i++) {
        A.push(i);
    }
    A[10] = 999;
    cout << A[10] << endl << A[20];
}