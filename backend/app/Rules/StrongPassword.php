<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements DataAwareRule, ValidationRule
{
    private array $data = [];

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $password = (string) $value;
        $lower = mb_strtolower($password, 'UTF-8');
        $compact = preg_replace('/[^a-z0-9]+/i', '', $lower) ?? $lower;

        if (mb_strlen($password) < 10) {
            $fail('The :attribute must be at least 10 characters.');
            return;
        }

        if (! preg_match('/[a-z]/', $password) || ! preg_match('/[A-Z]/', $password)) {
            $fail('The :attribute must include uppercase and lowercase letters.');
            return;
        }

        if (! preg_match('/\d/', $password)) {
            $fail('The :attribute must include at least one number.');
            return;
        }

        if (! preg_match('/[^A-Za-z0-9]/', $password)) {
            $fail('The :attribute must include at least one symbol.');
            return;
        }

        foreach ($this->blockedWords() as $word) {
            if ($compact === $word || str_contains($compact, $word)) {
                $fail('Do not use common words like password, admin, qwerty, or the site name in your :attribute.');
                return;
            }
        }

        foreach ($this->personalTerms() as $term) {
            if (str_contains($compact, $term)) {
                $fail('The :attribute must not contain your name or email.');
                return;
            }
        }
    }

    private function blockedWords(): array
    {
        return [
            'password',
            'passw0rd',
            'admin',
            'administrator',
            'qwerty',
            'azerty',
            '123456',
            '123456789',
            '111111',
            '000000',
            'bougdim',
            'librairie',
            'library',
            'welcome',
            'letmein',
            'iloveyou',
            'secret',
            'user',
            'client',
            'moderator',
            'maroc',
            'morocco',
        ];
    }

    private function personalTerms(): array
    {
        $terms = [];

        foreach (['name', 'email'] as $field) {
            $value = mb_strtolower((string) ($this->data[$field] ?? ''), 'UTF-8');
            $value = str_replace('@', ' ', $value);

            foreach (preg_split('/[^a-z0-9]+/i', $value, -1, PREG_SPLIT_NO_EMPTY) ?: [] as $term) {
                if (strlen($term) >= 4) {
                    $terms[] = $term;
                }
            }
        }

        return array_values(array_unique($terms));
    }
}
