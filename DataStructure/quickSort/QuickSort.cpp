#include<iostream>
using std::cout;
void Quicksort(int *data, int low, int high)
{
	if (low < high)
	{
		int i = low, j = high, x = data[low];
		while (i < j)
		{
			while (i < j&&data[j] > x)                //从右往左找到第一个小于x的数
				--j;
			data[i] = data[j];

			while (i < j&&data[i] < x)                //从左往右找到第一个大于x的数
				++i;
			data[j] = data[i];                  //降序排列

		}
		data[i] = x;
		Quicksort(data, low, i - 1);                  //递归调用
		Quicksort(data, i + 1, high);
	}
}
int main()
{
	int data[10] = { 1,7,6,4,9,14,19,100,55,10 };
	const int length = sizeof(data) / sizeof(data[0]) - 1;
	Quicksort(data, 0, length);
	for (int i = 0; i <= length; i++)
	{
		cout << data[i] << "  ";
	}
	return 0;
}