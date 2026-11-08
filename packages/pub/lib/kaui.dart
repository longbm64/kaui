import 'package:flutter/material.dart';

class KauiColors {
  static const primary = Color(0xFF2563EB);
  static const surface = Color(0xFFFFFFFF);
  static const textMain = Color(0xFF0F172A);
  static const textMuted = Color(0xFF64748B);
  static const border = Color(0xFFE2E8F0);
  static const success = Color(0xFF059669);
  static const error = Color(0xFFDC2626);
}

class KauiSpacing {
  static const s1 = 4.0;
  static const s2 = 8.0;
  static const s3 = 12.0;
  static const s4 = 16.0;
  static const s6 = 24.0;
}

class KauiTheme {
  static ThemeData light() => ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: KauiColors.primary),
        inputDecorationTheme: const InputDecorationTheme(border: OutlineInputBorder()),
      );

  static ThemeData dark() => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(seedColor: KauiColors.primary, brightness: Brightness.dark),
      );
}

class KauiButton extends StatelessWidget {
  const KauiButton({super.key, required this.label, this.onPressed, this.loading = false});
  final String label;
  final VoidCallback? onPressed;
  final bool loading;

  @override
  Widget build(BuildContext context) => FilledButton(
        onPressed: loading ? null : onPressed,
        child: loading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : Text(label),
      );
}

class KauiCard extends StatelessWidget {
  const KauiCard({super.key, required this.child});
  final Widget child;
  @override
  Widget build(BuildContext context) => Card(child: Padding(padding: const EdgeInsets.all(KauiSpacing.s4), child: child));
}

class KauiTextField extends StatelessWidget {
  const KauiTextField({super.key, this.label, this.controller, this.obscureText = false});
  final String? label;
  final TextEditingController? controller;
  final bool obscureText;
  @override
  Widget build(BuildContext context) => TextField(controller: controller, obscureText: obscureText, decoration: InputDecoration(labelText: label));
}

class KauiBadge extends StatelessWidget {
  const KauiBadge({super.key, required this.label});
  final String label;
  @override
  Widget build(BuildContext context) => Chip(label: Text(label), visualDensity: VisualDensity.compact);
}

class KauiAlert extends StatelessWidget {
  const KauiAlert({super.key, required this.message, this.isError = false});
  final String message;
  final bool isError;
  @override
  Widget build(BuildContext context) => Container(width: double.infinity, padding: const EdgeInsets.all(KauiSpacing.s3), color: isError ? KauiColors.error.withValues(alpha: .12) : KauiColors.success.withValues(alpha: .12), child: Text(message));
}
