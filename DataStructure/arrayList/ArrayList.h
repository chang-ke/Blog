#ifndef ARRAY_LISTH
#define ARRAY_LISTH

template<class T>
class ArrayList {
public:
	ArrayList();
	ArrayList(T arr[], int len);
	void push(T val);
	int& operator [](int i);
private:
	const int INITAL_CAPACITY = 10;
	int MAX_CAPACITY;
	int size;
	T *array;
};

template<class T>
ArrayList<T>::ArrayList() {
	size = 0;
	MAX_CAPACITY = INITAL_CAPACITY;
	array = new T[INITAL_CAPACITY];
}

template<class T>
ArrayList<T>::ArrayList(T arr[], int len) {
	size = len;
	MAX_CAPACITY = len;
	array = arr;
}

template<class T>
void ArrayList<T>::push(T val) {
	if (size < MAX_CAPACITY) {
		array[size] = val;
		size++;
	}
	else {
		MAX_CAPACITY = (size * 3 >> 1) + 1;
		T *arr = new T[MAX_CAPACITY];
		for (int i = 0; i < size; ++i) {
			arr[i] = array[i];
		}
		arr[size] = val;
		array = arr;
		size++;
	}
}

template<class T>
int& ArrayList<T>::operator[](int index) {
	if (index > size - 1) {
		return array[i];
	}
	else {
		cout << "error!";
		exit(0);
	}
}

#endif // !ARRAY_LISTH

