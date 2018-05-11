#include<iostream>
#include<algorithm> //引入排序函数
using std::cout;

int binary_search(int array[], int length, int target) {
	int low = 0, high = length, middle = 0;
	while (low < high) {
		middle = (low + high) / 2;
		if (target == array[middle]) {
			return middle;
		}
		else if (target < array[middle]) {
			high = middle;
		}
		else if (target > array[middle]) {
			low = middle + 1;
		}
	}
	return -1;
}


void find(int arr[], int sum, int length) {
	std::sort(arr, arr + length);
	for (int i = 0; i < length; ++i) {
		int num = sum - arr[i];
		int index = binary_search(arr, length, num);
		if (index >= 0 && index < length) {
			if (arr[i] < arr[index]) { //升序排序，避免重复输出例 2 + 5 = 7， 5 + 2 = 7 后者不必输出
				cout << arr[i] << '\t' << arr[index] << std::endl;
			}

		}
	}
}

int main() {
	int array[10] = { 1,6,2,7,4,3,7,1,2,9 };
	const auto sum = 7;
	const auto length = sizeof(array) / sizeof(array[0]);
	find(array, sum, length);
	return 0;
}