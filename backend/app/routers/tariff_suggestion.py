import os
import asyncio
import anthropic
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.financial_profile import TariffSuggestionRequest

router = APIRouter(prefix="/tariff", tags=["tariff"])

LEVEL_MULTIPLIERS = {"0-1": 1.2, "1-3": 1.2, "3-5": 1.5, "5-10": 2.0, "10+": 2.0}
LEVEL_LABELS = {"0-1": "Junior", "1-3": "Junior/Mid", "3-5": "Mid/Senior", "5-10": "Senior", "10+": "Expert"}


def _build_prompt(req: TariffSuggestionRequest) -> str:
    min_rate = (req.desired_salary + req.fixed_expenses) / req.monthly_hours
    multiplier = LEVEL_MULTIPLIERS.get(req.years_of_experience or "1-3", 1.5)
    level = LEVEL_LABELS.get(req.years_of_experience or "1-3", "Mid")
    market_rate = round(min_rate * multiplier, 2)
    gap = round(req.current_hourly_rate - min_rate, 2)
    status = "por encima" if gap >= 0 else "por debajo"

    return f"""Eres un asesor financiero experto en carreras freelance.
Analiza la situación tarifaria de este freelancer y dá un análisis conciso, accionable y motivador en español.

## Perfil del freelancer
- Profesión: {req.profession}
- Experiencia: {req.years_of_experience} años → nivel {level}
- País: {req.country or "no especificado"}
- Moneda: {req.coin_type}

## Datos financieros
- Sueldo pretendido mensual: {req.coin_type} {req.desired_salary:,.0f}
- Gastos fijos mensuales: {req.coin_type} {req.fixed_expenses:,.0f}
- Horas disponibles al mes: {req.monthly_hours:.0f} h

## Cálculo de tarifa mínima
- Tarifa mínima (cobertura de costos): {req.coin_type} {min_rate:.2f}/hora
- Tarifa actual del freelancer: {req.coin_type} {req.current_hourly_rate:.2f}/hora
- Estado: está {abs(gap):.2f} {req.coin_type} {status} de la tarifa mínima
- Tarifa de mercado sugerida ({level} × {multiplier}x): {req.coin_type} {market_rate:.2f}/hora

## Tu tarea
Redactá un análisis de 3-4 párrafos breves que incluya:
1. Diagnóstico claro de la situación actual (¿está cubriendo costos? ¿cuánto margen tiene?)
2. Una recomendación concreta de tarifa objetivo con justificación de mercado
3. Dos acciones inmediatas específicas para alcanzar esa tarifa
4. Una perspectiva motivadora sobre el potencial de crecimiento

Sé directo, usa números concretos y tutea al freelancer."""


async def _stream_anthropic(prompt: str):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        yield "data: [ERROR] ANTHROPIC_API_KEY no configurada en el servidor.\n\n"
        return

    client = anthropic.Anthropic(api_key=api_key)
    try:
        with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            for text in stream.text_stream:
                # Escape newlines so each SSE message is a single line
                escaped = text.replace("\n", "\\n")
                yield f"data: {escaped}\n\n"
                await asyncio.sleep(0)  # yield control to event loop
    except Exception as e:
        yield f"data: [ERROR] {str(e)}\n\n"
    finally:
        yield "data: [DONE]\n\n"


@router.post("/suggest")
async def suggest_tariff(req: TariffSuggestionRequest):
    prompt = _build_prompt(req)
    return StreamingResponse(
        _stream_anthropic(prompt),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
