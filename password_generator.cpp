/*
 * ============================================================
 *  PASSWORD GENERATOR - C++ (OOP)
 *  Backend/CLI Implementation
 * ============================================================
 *  Lines of Code: ~110
 *  Compile: g++ password_generator.cpp -o pgen && ./pgen
 * ============================================================
 */
#include <iostream>
#include <string>
#include <vector>
#include <random>
#include <algorithm>
#include <cctype>

class PasswordGenerator {
private:
    std::string lower = "abcdefghijklmnopqrstuvwxyz";
    std::string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    std::string digit = "0123456789";
    std::string symbol = "!@#$%^&*()-_=+[]{};:,.<>/?";
    std::string pool;

    std::random_device rd;
    std::mt19937 gen;

public:
    PasswordGenerator() : gen(rd()) {}

    std::string generate(int length, bool useUpper,
                         bool useDigit, bool useSymbol) {
        pool = lower;
        if (useUpper)  pool += upper;
        if (useDigit)  pool += digit;
        if (useSymbol) pool += symbol;

        std::uniform_int_distribution<> dis(0, (int)pool.size() - 1);
        std::string pwd;
        pwd.reserve(length);

        // Ensure at least one of each requested type
        if (useUpper)  pwd += upper[dis(gen)];
        if (useDigit)  pwd += digit[dis(gen)];
        if (useSymbol) pwd += symbol[dis(gen)];

        while ((int)pwd.size() < length)
            pwd += pool[dis(gen)];

        std::shuffle(pwd.begin(), pwd.end(), gen);
        return pwd;
    }

    std::string strength(const std::string& pwd) {
        int score = 0;
        if (pwd.size() >= 8)  score++;
        if (pwd.size() >= 12) score++;
        if (std::any_of(pwd.begin(), pwd.end(),
                        [](char c){ return std::isupper(c); })) score++;
        if (std::any_of(pwd.begin(), pwd.end(),
                        [](char c){ return std::isdigit(c); })) score++;
        if (std::any_of(pwd.begin(), pwd.end(),
                        [](char c){ return std::ispunct(c); })) score++;
        switch (score) {
            case 0: case 1: return "VERY WEAK";
            case 2: case 3: return "MODERATE";
            case 4:        return "STRONG";
            default:        return "VERY STRONG";
        }
    }
};

int main() {
    int length; char u, d, s;
    PasswordGenerator gen;

    std::cout << "\n========== PASSWORD GENERATOR (C++) ==========\n";
    std::cout << "Length (4-64): ";       std::cin >> length;
    std::cout << "UPPERCASE? (y/n): ";    std::cin >> u;
    std::cout << "Digits?    (y/n): ";    std::cin >> d;
    std::cout << "Symbols?   (y/n): ";    std::cin >> s;

    std::string pwd = gen.generate(length, u=='y', d=='y', s=='y');
    std::cout << "\nPassword : " << pwd  << "\n";
    std::cout << "Strength: " << gen.strength(pwd) << "\n";
    std::cout << "============================================\n";
    return 0;
}
