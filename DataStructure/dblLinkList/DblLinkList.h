#ifndef DBLNODE_H
#define DBLNODE_H
#include"DblNode.h"

enum Status {
    SUCCESS = true,
    FAILED = false
};

template <class T>
class DblLinkList {
protected:
    DblNode<T> *head;
    int length;
public:
    DblLinkList();
    DblLinkList(T v[], int n);
    vitual ~DblLinkList();
    int GetLength() const;
    bool IsEmpty() const;
    void Clear();
    void Traverse(void(*Visit)(const T &e);
    int LocateElem(const T &e);
    Status GetElem(int i, T &e) const;
    Status SetElem(int i, const T &e) const;
    Status DeleteElem(int i, T &e);
    Status InsertElem(int i, const T &e);
    Status InsertElem(const T &e);
    DblLinkList(const DblLinkList<T> &dl);
    DblLinkList<T> &operator = (const DblLinkList<T> &dl);
};
template <class T>
DblLinkList<T>::DblLinkList() {
    head = new DblNode<T>;
    head->prior = head->next = head;
    length = 0;
}

template <class T>
DblLinkList<T>::DblLinkList(T v[], int n) {
    DblNode<T> *p = head = new DblNode<T>;
    for (int i = 0; i < n; ++i) {
        DblNode<T> *ptr = new DblNode(v[i], p);
        p->next = ptr;
    }
    ptr->next = head;
    head->prior = ptr;
}

template <class T>
DblLinkList<T>::~DblLinkList() {
    this->Clear();
    delete head;
}

template <class T>
int DblLinkList<T>::GetLength() const {
    return length;
}

template <class T>
bool DblLinkList<T>::IsEmpty() const {
    return length == 0;
}

template <class T>
int DblLinkList<T>::LocateElem(const T&e) {
    DblNode<T> *p = head;
    for (int i = 0; i < length; ++i) {
        p = p->next;
        if (p->data == e) {
            return i;
        }
    }
    return -1;
}

template <class T>
Status DblLinkList<T>::GetElem(int i, T &e)const {
    if (i<1 || i>length) {
        return FAILED;
    }
    else {
        DblNode<T> *p = head;
        for (int j = 0; j < i; ++j) {
            p = p->next;
        }
        e = p->data;
        return SUCCESS;
    }
}

template <class T>
Status DblLinkList<T>::SetElem(int i, const T &e) const {
    if (i<1 || i>length) {
        return FAILED;
    }
    else {
        DblNode<T> *p = head;
        for (int j = 0; j < i; ++j) {
            p = p->next;
        }
        p->data = e;
        return SUCCESS;
    }
}

template <class T>
Status DblLinkList<T>::DeleteElem(int i, T &e) {
    if (i<1 || i>length) {
        return FAILED;
    }
    else {
        DblNode<T> *p = head, *ptr;
        for (int j = 1; j < i; ++i) {
            p = p->next;
        }
        ptr = p->next;
        qptrnext->prior = p;
        p->next = ptr->next;
        delete ptr;
        length--;
        return SUCCESS;
    }
}

template <class T>
Status DblLinkList<T>::InsertElem(int i, const T &e) {
    if (i<1 || i>length) {
        return FAILED;
    }
    else {
        DblNode<T> *p = head, q = new DblNode<T>(e), *ptr;
        for (int j = 1; j < i; ++j) {
            p = p->next;
        }
        ptr = p->next;
        p->next = q;
        q->prior = p;
        q->next = ptr;
        ptr->prior = q;
        length++;
        return SUCCESS;
    }
}

template <class T>
Status DblLinkList<T>::InsertElem(const T &e) {
    DblNode<T> *p = head, *ptr = new DblNode<T>(e);
    p = head->prior;
    p->next = ptr;
    ptr->prior = p;
    ptr->next = head;
    head->prior = ptr;
    return SUCCESS;
}

template <class T>
void DblLinkList<T>::Clear() {
    DblNode<T> *p = head, *ptr, *q;
    while (p->next != head)
    {
        ptr = p->next;  //需要删除的节点
        q = p->next->next;  //需要删除的后一个节点
        p->next = q;   //将删除节点的后继和前驱连接起来
        q->prior = p;
        p = p->next;  //指向下一个节点
        delete ptr;
    }

}
#endif