<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\GovApp;
use App\Models\OfficialEntity;
use App\Models\PhonebookEntry;
use App\Models\Place;
use App\Models\Route;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if (mb_strlen($q) < 2) {
            return response()->json([
                'routes' => [],
                'places' => [],
                'phonebook' => [],
                'officials' => [],
                'govapps' => [],
            ]);
        }

        $q = mb_substr($q, 0, 80);
        $like = '%' . addcslashes($q, '%_\\') . '%';

        $routes = Route::query()
            ->where('status', 'published')
            ->where(function ($query) use ($like) {
                $query->where('name_ar', 'like', $like)
                    ->orWhere('name_en', 'like', $like);
            })
            ->limit(5)
            ->get(['id', 'city_id', 'name_ar', 'name_en'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'cityId' => $r->city_id,
                'nameAr' => $r->name_ar,
                'nameEn' => $r->name_en,
            ])
            ->values();

        $places = Place::query()
            ->where('status', 'approved')
            ->where(function ($query) use ($like) {
                $query->where('name', 'like', $like)
                    ->orWhere('description', 'like', $like);
            })
            ->limit(5)
            ->get(['id', 'name', 'category'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'category' => $p->category,
            ])
            ->values();

        $phonebook = PhonebookEntry::query()
            ->where('is_active', true)
            ->where(function ($query) use ($like) {
                $query->where('name_ar', 'like', $like)
                    ->orWhere('name_en', 'like', $like)
                    ->orWhere('number', 'like', $like);
            })
            ->orderBy('order_column')
            ->limit(5)
            ->get(['id', 'name_ar', 'name_en', 'number'])
            ->map(fn ($e) => [
                'id' => $e->id,
                'nameAr' => $e->name_ar,
                'nameEn' => $e->name_en,
                'number' => $e->number,
            ])
            ->values();

        $officials = OfficialEntity::query()
            ->where('is_active', true)
            ->where(function ($query) use ($like) {
                $query->where('name_ar', 'like', $like)
                    ->orWhere('name', 'like', $like)
                    ->orWhere('description_ar', 'like', $like);
            })
            ->orderBy('order_column')
            ->limit(5)
            ->get(['id', 'name_ar', 'name', 'category_id'])
            ->map(fn ($o) => [
                'id' => $o->id,
                'nameAr' => $o->name_ar ?: $o->name,
                'nameEn' => $o->name,
                'categoryId' => $o->category_id,
            ])
            ->values();

        $govapps = GovApp::query()
            ->where('is_active', true)
            ->where(function ($query) use ($like) {
                $query->where('name_ar', 'like', $like)
                    ->orWhere('name', 'like', $like)
                    ->orWhere('description_ar', 'like', $like);
            })
            ->orderBy('order_column')
            ->limit(4)
            ->get(['id', 'name_ar', 'name'])
            ->map(fn ($g) => [
                'id' => $g->id,
                'nameAr' => $g->name_ar ?: $g->name,
                'nameEn' => $g->name,
            ])
            ->values();

        return response()->json([
            'routes' => $routes,
            'places' => $places,
            'phonebook' => $phonebook,
            'officials' => $officials,
            'govapps' => $govapps,
        ]);
    }
}
