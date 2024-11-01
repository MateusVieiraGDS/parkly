<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Membro extends Model
{
    use HasFactory;
    use SoftDeletes;
    

    protected $table = 'membros';

    protected $hidden = [
        'id',
        'user_id',
        'file_cert_nascimento',
        'file_doc_image',
        'file_foto'
    ];

    protected $fillable = [
        'uuid',
        'rg',
        'cpf',
        'nasc',
        'sexo',
        'estado_civil',
        'rg_state_id',
        'nat_state_id',
        'nat_city_id',
        'user_id',
        'grupo_id',
        'congregacao_id',
        'situacao',
        'pendencia',
        'file_cert_nascimento',
        'file_doc_image',
        'file_foto'
    ];

    public function User()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function fileCertNascimento(){
        return $this->belongsTo(UploadFile::class, 'file_cert_nascimento');
    }

    public function fileDocImage(){
        return $this->belongsTo(UploadFile::class, 'file_doc_image');
    }

    public function fileFoto(){
        return $this->belongsTo(UploadFile::class, 'file_foto');
    }

    public function CargoAtual(){
        return $this->TodosCargos()
            ->wherePivot('situacao', 'ATIVO')
            ->limit(1);
    }

    public function TodosCargos(){
        return $this->belongsToMany(Cargo::class, 'consagracoes', 'membro_id', 'cargo_id');
    }
    
    public function Grupo()
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    public function Congregacao(){
        return $this->belongsTo(Congregacao::class, 'congregacao_id');
    }

    public function DadosComplmentar(){
        return $this->hasOne(DadosComplementar::class, 'membro_id');
    }

    public function Enderecos(){
        return $this->hasMany(Endereco::class, 'membro_id');
    }

    public function Telefones(){
        return $this->hasMany(Telefone::class, 'membro_id');
    }

    public function Disciplinas(){
        return $this->hasMany(Disciplina::class, 'membro_id');
    }


    public function Batismo(){
        return $this->hasOne(Batismo::class, 'membro_id');
    }

    public function Casamentos(){
        return $this->hasMany(Casamento::class, 'membro_conjuge_1')
            ->union($this->hasMany(Casamento::class, 'membro_conjuge_2'));
    }

    public function nat_state()
    {
        return $this->belongsTo(State::class, 'nat_state_id');
    }

    public function nat_city()
    {
        return $this->belongsTo(City::class, 'nat_city_id');
    }

    public function rg_state()
    {
        return $this->belongsTo(State::class, 'rg_state_id');
    }
}
