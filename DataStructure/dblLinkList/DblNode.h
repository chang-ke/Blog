#ifndef DBLNODE_H
#define DBLNODE_H

template <class T>
struct DblNode
{
	T data;
	DblNode<T> *prior;
	DblNode<T> *next;
	DblNode();
	DblNode(T e, DblNode<T> *priorlink = NULL, DblNode<T> *nextlink = NULL);
};

template <class T>
DblNode<T>::DblNode() {
	prior = NULL;
	next = NULL;
}

template <class T>
DblNode<T>::DblNode(T e, DblNode<T> *priorlink = NULL, DblNode<T> *nextlink = NULL) {
	data = e;
	prior = priorlink;
	next = nextlink;
}
#endif // !DBLNODE_H