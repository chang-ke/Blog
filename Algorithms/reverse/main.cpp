#include<iostream>
#include"Node.h"
using namespace std;

template<class T>
void reverse(Node<T> *head) {
    Node<T> *p = head->next;
    Node<T> *q = NULL;
    Node<T> *ptr = NULL;
    while (p) {
        ptr = p->next;
        p->next = q;
        q = p;
        p = ptr;
    }
    head->next = q;
}

int main() {
    Node<int> *head = new Node<int>, *ptr;
    ptr = head->next = new Node<int>;
    for (int i = 0; i < 10; ++i) {
        ptr->data = i;
        ptr->next = new Node<int>;
        ptr = ptr->next;
    }
    ptr->data = -1;
    reverse(head);
    ptr = head->next;
    while (ptr != NULL)
    {
        cout << ptr->data << "\n";
        ptr = ptr->next;
    }
    return 0;
}