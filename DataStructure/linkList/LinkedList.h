#ifndef LINKLIST
#define LINKLIST
#include"Node.h";

enum Status {
    SUCCESS = true,
    FAILED = false
};

template <class T>
class LinkList {
protected:
    Node<T> *head;
    int length;
public:
    LinkList();
    LinkList(T v[], int n);
    virtual ~LinkList();
    int GetLength() const;
    bool IsEmpty() const;
    void Clear();
    void Traverse(void(*Visit)(const T&)) const;
    int LocateElem(const T &e);
    Status GetElem(int i, T &e) const;
    Status SetElem(int i, const T &e);
    Status DeleteElem(int i, T &e);
    Status Insert(int i, const T &e);
    Status InsertElem(const &e);
    LinkList(const LinkList<T> l);
    LinkList<T> &operator =(const LinkList<T> &l);
};

template <class T>
LinkList<T>::LinkList() {
    head = new Node<T>;
    length = 0;
}

template <class T>
LinkList<T>::LinkList(T v[], int n) {
    Node<T> *p = head;
    for (int i = 0; i < n; ++i) {
        p->next = new Node<T>(v[i], NULL);
        p = p->next;
    }
    length = n;
}

template <class T>
LinkList<T>::~LinkList() {
    this->Clear();
    delete head;
}

template <class T>
int LinkList<T>::GetLength() const {
    return length;
}

template <class T>
bool LinkList<T>::IsEmpty() const {
    return length == 0;
}

template <class T>
void LinkList<T>::Clear() {
    Node *p = head->next;
    while (p != NULL) {
        head->next = p->next;
        delete p;
        p = head->next;
    }
    length = 0;
}

template <class T>
void LinkList<T>::Traverse(void(*visit)(const T&))const {
    Node<T> *p = head->next;
    while (p != NULL)
    {
        (*visit)(p);
        p = p->next;
    }

}
template <class T>
int LinkList<T>::LocateElem(const T &e) {
    Node<T> *p = head;
    int i = 1;
    for (p; p->next->data != e; p = p->next) {
        i++;
    }
    return i;
}
template <class T>
Status LinkList<T>::GetElem(int i, T &e) const {
    if (i<1 || i>length) {
        return FAILED;
    }
    else {
        Node<T> *p = head;
        for (int j = 0; j < i; ++j) {
            p = p->next;
        }
        e = p->data;
        return SUCCESS;
    }
}
template <class T>
Status LinkList<T>::SetElem(int i, const T &e) {
    Node<T> *p = head;
    for (int j = 0; j < i; ++j) {
        p = p->next;
    }
    p->data = e;
    return SUCCESS;
}

template <class T>
Status LinkList<T>::DeleteElem(int i, T &e) {
    if (i < 0 || i > length) {
        return FAILED;
    }
    else {
        Node<T> *p = head, *q;
        for (int j = 0; j < i; ++j) {
            p = p->next;
        }
        q = p->next;
        p->next = q->next;
        e = q->data;
        length--;
        delete q;
        return SUCCESS;
    }
}

template <class T>
Status LinkList<T>::Insert(int i, const T &e) {
    if (i < 0 || i > length) {
        return FAILED;
    }
    else {
        Node<T> *p = head, *ptr;
        for (int j = 1; j < i; ++i) {
            p = p->next;
        }
        ptr->data = e;
        ptr->next = p->next;
        p->next = ptr;
        length++;
        return SUCCESS;
    }
}

template <class T>
Status LinkList<T>::InsertElem(const &e) {
    Node<T> *p = head, *ptr;
    for (int i = 0; i < length; ++i) {
        p = p->next;
    }
    ptr->data = e;
    p->next = ptr;
    ptr->next = NULL;
    return SUCCESS;
}

template <class T>
LinkList<T>::LinkList(const LinkList<T> l) {
    this->length = l->length;
    this->head = l->head;
}

template <class T>
LinkList<T>& LinkList<T>::operator = (const LinkList<T> &l) {
    this->length = l->length;
    this->head = l->head;
    return *this;
}
#endif