#include "process.hpp"


#include <iostream>
#include <TlHelp32.h>
#include <cstdio>
#include <wchar.h>
#include <tchar.h>

#include "../utils.hpp"

auto Process::attach() -> bool
{
	process = OpenProcess(PROCESS_VM_READ | PROCESS_VM_WRITE | PROCESS_VM_OPERATION, FALSE, process_id);
	if (!process)
		return false;
	
	return true;
}

auto Process::detach() -> void
{
	if (process)
		CloseHandle(process);

	process = nullptr;
	process_id = NULL;
	csgo = { NULL, NULL };
	engine = { NULL, NULL };
	client = { NULL, NULL };
}

auto Process::write(DWORD_PTR dw_address, LPCVOID lpc_buffer, DWORD_PTR dw_size) -> bool
{
	return (WriteProcessMemory(process, reinterpret_cast<LPVOID>(dw_address), lpc_buffer, dw_size, nullptr) == TRUE);
}

auto Process::read(DWORD_PTR dw_address, LPVOID lp_buffer, DWORD_PTR dw_size) -> bool
{
	return (ReadProcessMemory(process, reinterpret_cast<LPCVOID>(dw_address), lp_buffer, dw_size, nullptr) == TRUE);
}

bool DataCompare(const BYTE* pData, const BYTE* pMask, const char* pszMask)
{
	for (; *pszMask; ++pszMask, ++pData, ++pMask)
	{
		if (*pszMask == 'x' && *pData != *pMask)
		{
			return false;
		}
	}

	return (*pszMask == NULL);
}

auto Process::scan(DWORD_PTR start, DWORD_PTR size, const char* signature, const char* mask) -> DWORD_PTR
{
	const auto remote = new BYTE[size];

	if (!read(start, remote, size))
	{
		delete[] remote;
		return NULL;
	}

	for (size_t i = 0; i < size; i++)
	{
		if (DataCompare(static_cast<const BYTE*>(remote + i), reinterpret_cast<const BYTE*>(signature), mask))
		{
			delete[] remote;
			return start + i;
		}
	}
	delete[] remote;

	return NULL;
}

auto Process::get_module_base_address(const char* str_module_name) -> std::array<DWORD, 2>
{
	HANDLE h_snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, process_id);
	if (h_snapshot == INVALID_HANDLE_VALUE)
		return { NULL, NULL };

	MODULEENTRY32 module_entry;
	module_entry.dwSize = sizeof(MODULEENTRY32);
	
	if (Module32First(h_snapshot, &module_entry))
	{
		if (!strcmp(str_module_name, module_entry.szModule)) {
			CloseHandle(h_snapshot);
			return { reinterpret_cast<DWORD>(module_entry.modBaseAddr), module_entry.modBaseSize };
		}
	}
	while (Module32Next(h_snapshot, &module_entry))
	{
		if (!strcmp(str_module_name, module_entry.szModule)) {
			CloseHandle(h_snapshot);
			return { reinterpret_cast<DWORD>(module_entry.modBaseAddr), module_entry.modBaseSize };
		}
	}
	CloseHandle(h_snapshot);
	return { NULL, NULL };
}
/*
class CRecvProp;
class CRecvTable
{
public:
	const char* GetTableName()
	{
		char pszTableName[128];
		ReadProcessMemory(process->process, reinterpret_cast<LPCVOID>(process->read<DWORD_PTR>(reinterpret_cast<DWORD_PTR>(this) + 0xC)), &pszTableName, sizeof(pszTableName), nullptr);
		return pszTableName;
	}

	int GetMaxProp()
	{
		return process->read<int>(reinterpret_cast<DWORD_PTR>(this) + 0x4);
	}

	CRecvProp* GetProp(int iIndex)
	{
		return reinterpret_cast<CRecvProp*>(process->read<DWORD_PTR>(reinterpret_cast<DWORD_PTR>(this) + 0x3C * iIndex));
	}
};

class CRecvProp
{
public:
	const char* GetVarName()
	{
		char pszVarName[128];
		ReadProcessMemory(process->process, reinterpret_cast<LPCVOID>(process->read<DWORD_PTR>(reinterpret_cast<DWORD_PTR>(this))), &pszVarName, sizeof(pszVarName), nullptr);
		return pszVarName;
	}

	int GetOffset()
	{
		return process->read<int>(reinterpret_cast<DWORD_PTR>(this) + 0x2C);
	}

	CRecvTable* GetDataTable()
	{
		return process->read<CRecvTable*>(reinterpret_cast<DWORD_PTR>(this) + 0x28);
	}
};

class ClientClass
{
public:
	const char* GetNetworkName()
	{
		char pszNetworkName[128];
		ReadProcessMemory(process->process, reinterpret_cast<LPCVOID>(process->read<DWORD_PTR>(reinterpret_cast<DWORD_PTR>(this) + 0x8)), &pszNetworkName, sizeof(pszNetworkName), nullptr);
		return pszNetworkName;
	}

	ClientClass* GetNextClass()
	{
		return process->read<ClientClass*>(reinterpret_cast<DWORD_PTR>(this) + 0x10);
	}

	CRecvTable* GetTable()
	{
		return process->read<CRecvTable*>(reinterpret_cast<DWORD_PTR>(this) + 0xC);
	}
};

auto Process::find_netvar(DWORD_PTR dwClasses, const char* table, const char* var) -> DWORD_PTR
{
	CRecvProp* _prop[3];
	for (auto _class = reinterpret_cast<ClientClass*>(dwClasses); _class; _class = _class->GetNextClass())
	{
		if (strcmp(table, _class->GetTable()->GetTableName()))
			continue;

		for (auto i = 0; i < _class->GetTable()->GetMaxProp(); ++i)
		{
			_prop[0] = _class->GetTable()->GetProp(i);
			if (isdigit(_prop[0]->GetVarName()[0]))
				continue;
			
			if (!strcmp(_prop[0]->GetVarName(), var))
				return _prop[0]->GetOffset();
			
			if (!_prop[0]->GetDataTable())
				continue;

			for (auto j = 0; j < _prop[0]->GetDataTable()->GetMaxProp(); ++j)
			{
				_prop[1] = _prop[0]->GetDataTable()->GetProp(j);
				if (isdigit(_prop[1]->GetVarName()[0]))
					continue;

				if (!strcmp(_prop[1]->GetVarName(), var))
					return _prop[1]->GetOffset();

				if (!_prop[1]->GetDataTable())
					continue;

				for (auto k = 0; k < _prop[1]->GetDataTable()->GetMaxProp(); ++k)
				{
					_prop[2] = _prop[1]->GetDataTable()->GetProp(k);
					if (isdigit(_prop[2]->GetVarName()[0]))
						continue;

					if (!strcmp(_prop[2]->GetVarName(), var))
						return _prop[2]->GetOffset();
				}
			}
		}
	}
	return NULL;
}
*/