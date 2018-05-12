#pragma once

#define DEFAULT_SIZE 50

template<class T>
int GET_LENGTH(T array[]) {
	return sizeof(array) / sizeof(array[0]);
}

enum Status
{
	SUCCESS = true,
	FAILED = false
};

template <class T>
class SeqList {
protected:
	int length;
	int max_length;
	T *elems;
public:
	SeqList(int size = DEFAULT_SIZE);
	SeqList(T array[], int size = DEFAULT_SIZE);
	virtual ~SeqList();
	int GetLength();
	bool IsEmpty();
	void Clear();
	void Traverse(void(*Visit)(const T &)) const;
	int GetPosition(const T &e);
	Status GetElem(int i, const T &e);
	Status SetElem(int i, const T &e);
	Status DeleteElem(int i, T &e);
	Status InsertElem(int i, const T &e);
	Status InsertElem(const T &e); //表尾插入
	SeqList(const SeqList<T> &s);
	SeqList<T> &operator = (const SeqList<T> &s);
};

template <class T>
SeqList<T>::SeqList(int size = DEFAULT_SIZE) {
	elems = new T[size];
	max_length = size;
	length = 0;
}

template <class T>
SeqList<T>::SeqList(T array[], int size = DEFAULT_SIZE) {
	elems = new T[size];
	max_length = size;
	length = GET_LENGTH(array);
	std::cout << length;
	for (int i = 0; i < length; ++i) {
		elems[i] = array[i];
	}
}
template <class T>
SeqList<T>::~SeqList() {
	delete[]elems;
}
template <class T>
int SeqList<T>::GetLength() {
	return length;
}



template <class T>
bool SeqList<T>::IsEmpty() {
	return length == 0;
}

template <class T>
void SeqList<T>::Clear() {
	length = 0;
	delete[] elems;
}

template <class T>
void SeqList<T>::Traverse(void(*Visit)(const T &))const {
	for (int i = 0; i < length; ++i) {
		*visit(elems[i]);
	}
}

template <class T>
int SeqList<T>::GetPosition(const T&e) {
	for (int i = 0; i < length; ++i) {
		if (elems[i] == e) {
			return i
		}
	}
	return -1;
}

template <class T>
Status SeqList<T>::GetElem(int i, const T&e) {
	if (i >= 0 && i < length) {
		e = elems[i - 1];
		return SUCCESS;
	}
	else {
		return FAILED;
	}
}

template <class T>
Status SeqList<T>::SetElem(int i, const T&e) {
	if (i >= 0 && i < length) {
		elems[i - 1] = e;
		return SUCCESS;
	}
	else {
		return FAILED;
	}
}

template <class T>
Status SeqList<T>::DeleteElem(int i, T &e) {
	if (i >= 0 && i < length) {
		for (int j = i; j < length; ++j) {
			elems[j - 1] = elems[i];
		}

		length -= 1;
		return SUCCESS;
	}
	else {
		return FAILED;
	}
}

template <class T>
Status SeqList<T>::InsertElem(int i, const T&e) {
	if (i >= 0 && i < length && length < max_length) {
		for (int j = length; j > i; --j) {
			elems[j] = elems[j - 1];
		}
		elems[i - 1] = e;
		length++;
		return SUCCESS;
	}
	else {
		return FAILED;
	}
}

template <class T>
Status SeqList<T>::InsertElem(const T&e) {
	if (length < max_length) {
		elems[length] = e;
		length++
	}
	else {
		return FAILED;
	}
}

template <class T>
SeqList<T>::SeqList(const SeqList<T> &s) {
	this.length = s.length;
	this.max_length = s.max_length;
	delete[]elems;
	this.elems = new T[max_length];
	for (int i = 0; i < length; ++i) {
		this.elems[i] = s.elems[i];
	}
}

template <class T>
SeqList<T>& SeqList<T>::operator = (const SeqList<T> &s) {
	this.length = s.length;
	this.max_length = s.max_length;
	delete[]elems;
	this.elems = new T[max_length];
	for (int i = 0; i < length; ++i) {
		this.elems[i] = s.elems[i];
	}
	return *this;
};
