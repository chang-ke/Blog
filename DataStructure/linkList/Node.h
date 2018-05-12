#ifndef NODE_H
#define NODE_H

template <class T>
struct Node
{
	T data;
	Node<T> *next;
	Node();
	Node(T e, Node<T> *link = NULL);
};

template <class T>
Node<T>::Node() {
	next = NULL;
}

template <class T>
Node<T>::Node(T e, Node<T> *link = NULL) {
	data = e;
	next = link;
}
#endif // !NODE_H