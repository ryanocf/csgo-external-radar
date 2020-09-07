#pragma once
#define WIN32_LEAN_AND_MEAN
#include <Windows.h>
#include <memory>
#include <string>
#include <array>
#include <vector>

class Process
{
public:
	auto attach() -> bool;
	auto detach() -> void;
	auto write(DWORD_PTR dw_address, LPCVOID lpc_buffer, DWORD_PTR dw_size) -> bool;
	auto read(DWORD_PTR dw_address, LPVOID lp_buffer, DWORD_PTR dw_size) -> bool;
	auto scan(DWORD_PTR start, DWORD_PTR size, const char* signature, const char* mask) -> DWORD_PTR;
	auto find_netvar(DWORD_PTR dwClasses, const char* table, const char* var) -> DWORD_PTR;

	template<typename T>
	auto read(const DWORD_PTR& dw_address, const T& t_default = T()) -> T
	{
		T t_ret;
		if (!read(dw_address, &t_ret, sizeof(T)))
			return t_default;

		return t_ret;
	}

	template<typename T>
	auto read_multi(DWORD_PTR dw_address, std::vector<DWORD_PTR> v_offset, const T& tDefault = T()) -> T
	{
		T t_ret = dw_address;
		for (auto i = 0; i < v_offset.size(); i++)
		{
			read(t_ret + v_offset[i], &t_ret, sizeof(T));
		}
		return t_ret;
	}
	
	template<typename T>
	auto write(const DWORD_PTR& dw_address, const T& t_value) -> bool
	{
		return write(dw_address, &t_value, sizeof(T));
	}

	auto get_module_base_address(const char* str_module_name) -> std::array<DWORD, 2>;

public:
	HWND window = nullptr;
	HANDLE process = nullptr;
	DWORD process_id = NULL;

	std::array<DWORD, 2> csgo = { NULL, NULL };
	std::array<DWORD, 2> engine = { NULL, NULL };
	std::array<DWORD, 2> client = { NULL, NULL };
};

inline std::unique_ptr<Process> process = std::make_unique<Process>();