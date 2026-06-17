/*
 * ============================================================
 *  PASSWORD GENERATOR - C Language
 *  Backend/CLI Implementation
 * ============================================================
 *  Lines of Code: ~85
 *  Compile: gcc password_generator.c -o pgen && ./pgen
 * ============================================================
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAX_LEN 256

/* Character pools */
const char *LOWER = "abcdefghijklmnopqrstuvwxyz";
const char *UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const char *DIGIT = "0123456789";
const char *SYMBOL = "!@#$%^&*()-_=+[]{};:,.<>/?";

/* Build the pool based on user choices */
void build_pool(char *pool, int use_upper, int use_digit, int use_symbol) {
    strcpy(pool, LOWER);
    if (use_upper)  strcat(pool, UPPER);
    if (use_digit)  strcat(pool, DIGIT);
    if (use_symbol) strcat(pool, SYMBOL);
}

/* Calculate strength score */
int strength_score(const char *pwd) {
    int score = 0;
    int len = strlen(pwd);
    if (len >= 8)  score++;
    if (len >= 12) score++;
    if (strpbrk(pwd, UPPER))  score++;
    if (strpbrk(pwd, DIGIT))  score++;
    if (strpbrk(pwd, SYMBOL)) score++;
    return score;
}

const char* strength_label(int score) {
    switch (score) {
        case 0: case 1: return "VERY WEAK";
        case 2: case 3: return "MODERATE";
        case 4:        return "STRONG";
        default:        return "VERY STRONG";
    }
}

int main(void) {
    int length, use_upper, use_digit, use_symbol;
    char pool[MAX_LEN];
    char password[MAX_LEN];

    srand((unsigned)time(NULL));

    printf("\n========== PASSWORD GENERATOR (C) ==========\n");
    printf("Enter password length (4-64): ");
    scanf("%d", &length);
    if (length < 4 || length > 64) {
        printf("Invalid length!\n");
        return 1;
    }
    printf("Include UPPERCASE? (1/0): "); scanf("%d", &use_upper);
    printf("Include digits?     (1/0): "); scanf("%d", &use_digit);
    printf("Include symbols?    (1/0): "); scanf("%d", &use_symbol);

    build_pool(pool, use_upper, use_digit, use_symbol);
    int pool_size = (int)strlen(pool);

    for (int i = 0; i < length; i++)
        password[i] = pool[rand() % pool_size];
    password[length] = '\0';

    printf("\nGenerated Password : %s\n", password);
    printf("Strength          : %s\n", strength_label(strength_score(password)));
    printf("===========================================\n\n");
    return 0;
}
