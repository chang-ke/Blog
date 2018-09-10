#include<iostream>
#include<string>
using std::string;


int calc_next(const string &pat, int *next) {
    int len = pat.length();
    int k = 0;
    next[0] = 0;
    for (int i = 1; i < len; ++i) {
        while (k > 0 && pat[k] != pat[i]) {
            k = next[k - 1]; //匹配失败需要回溯到next数组前一个坐标值处，重复直到匹配
        }
        if (pat[k] == pat[i]) {
            k++; //往后匹配
        }
        next[i] = k;
    }
    return 0;
}

int KMP(const string &str, const string &pat, int start = 0) {
    int k = 0;
    int strlen = (int)str.length();
    int patlen = (int)pat.length();
    int *next = new int[patlen];
    calc_next(pat, next);
    for (int i = start; i < strlen; ++i) {
        while (k > 0 && pat[k] != str[i]) {
            k = next[k - 1];
        }
        if (pat[k] == str[i]) {
            k++;
        }
        if (k == patlen) {
            return i - patlen + 1;
        }
    }
    return -1;
}

int main() {
    cout << KMP("afcasasfgasfasassasf", "asf", 1);
    return 0;
}